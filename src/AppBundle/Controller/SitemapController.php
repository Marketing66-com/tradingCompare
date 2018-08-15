<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 8/14/2018
 * Time: 3:50 PM
 */

namespace AppBundle\Controller;

use GuzzleHttp\Exception\GuzzleException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;


class SitemapController extends Controller
{

    /**
     * Génère le sitemap du site.
     *
     * @Route("/sitemap.{_format}", name="front_sitemap", Requirements={"_format" = "xml"})
     */
    public function sitemapAction(Request $request)
    {
        $urls = [];
        $hostname = $request->getHost();

        $urls[] = ['loc' => $this->get('router')->generate('Live_rates_stocks'), 'changefreq' => 'weekly', 'priority' => '0.7'];
        $urls[] = ['loc' => $this->get('router')->generate('Live_rates_crypto'), 'changefreq' => 'weekly', 'priority' => '0.7'];
        $urls[] = ['loc' => $this->get('router')->generate('Live_rates_forex'), 'changefreq' => 'weekly', 'priority' => '0.7'];

        $urls[] = ['loc' => $this->get('router')->generate('crypto'), 'changefreq' => 'weekly', 'priority' => '0.5'];
        $urls[] = ['loc' => $this->get('router')->generate('forex'), 'changefreq' => 'weekly', 'priority' => '0.5'];
        $urls[] = ['loc' => $this->get('router')->generate('commodities'), 'changefreq' => 'weekly', 'priority' => '0.5'];
        $urls[] = ['loc' => $this->get('router')->generate('stock'), 'changefreq' => 'weekly', 'priority' => '0.5'];

        $urls[] = ['loc' => $this->get('router')->generate('etoro'), 'changefreq' => 'weekly', 'priority' => '0.6'];
        $urls[] = ['loc' => $this->get('router')->generate('24option'), 'changefreq' => 'weekly', 'priority' => '0.6'];
        $urls[] = ['loc' => $this->get('router')->generate('trade'), 'changefreq' => 'weekly', 'priority' => '0.6'];
        $urls[] = ['loc' => $this->get('router')->generate('plus500'), 'changefreq' => 'weekly', 'priority' => '0.6'];
        $urls[] = ['loc' => $this->get('router')->generate('pepperstone'), 'changefreq' => 'weekly', 'priority' => '0.6'];
        $urls[] = ['loc' => $this->get('router')->generate('alvexo'), 'changefreq' => 'weekly', 'priority' => '0.6'];
        $urls[] = ['loc' => $this->get('router')->generate('market'), 'changefreq' => 'weekly', 'priority' => '0.6'];

        $urls[] = ['loc' => $this->get('router')->generate('terms'), 'changefreq' => 'weekly', 'priority' => '0.2'];
        $urls[] = ['loc' => $this->get('router')->generate('privacy'), 'changefreq' => 'weekly', 'priority' => '0.2'];


        $client = new \GuzzleHttp\Client();
        try {
            $res = $client->request('GET', 'https://crypto-ws.herokuapp.com/All-Froms-and-Prices');
            $data = json_decode($res->getBody(), true);
            foreach ($data as $item) {
                if(isset($item['pair'])) {
                    $urls[] = ['loc' => $this->get('router')->generate('crypto_chart', ['currency' => $item['pair']]), 'changefreq' => 'weekly', 'priority' => '0.8'];
                }
            }
        } catch (GuzzleException $e) {
            $this->get('logger')->error($e->getMessage());
        }

        try {
            $res = $client->request('GET', 'https://forex-websocket.herokuapp.com/all_data');
            $data = json_decode($res->getBody(), true);
            foreach ($data as $item) {
                if(isset($item['pair'])) {
                    $urls[] = ['loc' => $this->get('router')->generate('forex_chart', ['currency' => $item['pair']]), 'changefreq' => 'weekly', 'priority' => '0.8'];
                }
            }
        } catch (GuzzleException $e) {
            $this->get('logger')->error($e->getMessage());
        }

        try {
            $res = $client->request('GET', 'https://websocket-stock.herokuapp.com/stocksPrice');
            $data = json_decode($res->getBody(), true);
            foreach ($data as $item) {
                if(isset($item['pair'])) {
                    $urls[] = ['loc' => $this->get('router')->generate('stock_chart', ['currency' => $item['pair']]), 'changefreq' => 'weekly', 'priority' => '0.8'];
                }
            }
        } catch (GuzzleException $e) {
            $this->get('logger')->error($e->getMessage());
        }

        return $this->render('sitemap.xml.twig', [
            'urls' => $urls,
            'hostname' => $hostname
        ]);
    }
}