<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 8/14/2018
 * Time: 3:50 PM
 */

namespace AppBundle\Controller\Web;

use GuzzleHttp\Exception\GuzzleException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\BrowserKit\Client;

class SitemapController extends Controller
{

    /**
     * Génère le sitemap du site.
     *
     * @Route("/sitemap.{_format}", name="front_sitemap", Requirements={"_format" = "xml"}, options={ "i18n" = false})
     */
    public function sitemapAction(Request $request)
    {
        $urls = [];
        $hostname = $request->getHost();

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

        $client = new \GuzzleHttp\Client();
        try {
            $res = $client->request('GET', 'https://crypto.tradingcompare.com/AllPairs');
            $data = json_decode($res->getBody(), true);
            foreach ($data as $item) {
                if(isset($item['pair'])) {
                    $item['name'] = str_replace(" ", "-", $item['name']);
                    $urls[] = ['loc' => urldecode($this->get('router')->generate('crypto_chart', ['currency' => $item['pair'], 'name' => $item['name']])) , 'changefreq' => 'weekly', 'priority' => '0.8'];
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
                    $my_pair = substr($item['pair'], 0, 3) . '-' . substr($item['pair'], 3, 6);
                    $urls[] = ['loc' => $this->get('router')->generate('forex_chart', ['currency' => $my_pair]), 'changefreq' => 'weekly', 'priority' => '0.8'];
                }
            }
        } catch (GuzzleException $e) {
            $this->get('logger')->error($e->getMessage());
        }

        try {
            $res = $client->request('GET', 'https://websocket-stock.herokuapp.com/ListOfCountry');
            $data = json_decode($res->getBody(), true);
            $arrlength = count($data[0]) - 1;
                for ($x = 0; $x <= $arrlength; $x++) {

                    $country_name = str_replace(" ", "-", $data[1][$x]);
                    $country_value = str_replace(" ", "-", $data[0][$x]);
                    $urls[] = ['loc' => urldecode($this->get('router')->generate('Live_rates_stocks', ['name' => $country_name, 'value' => $country_value ])), 'changefreq' => 'weekly', 'priority' => '0.8'];

                    $res2 = $client->request('GET', 'https://websocket-stock.herokuapp.com/stocks/' . $data[0][$x]);
                    $data2 = json_decode($res2->getBody(), true);
                    foreach ($data2 as $item) {
                        $new_array = array(' ', '/', '----', '---', '--');
                        $item['name'] = str_replace('-', " ", $item['name']);
                        $item['name'] = str_replace("'", "", $item['name']);
                        $item['name'] = str_replace($new_array, "-", $item['name']);

                        if(isset($item['pair'])) {
                        $urls[] = ['loc' => urldecode($this->get('router')->generate('stock_chart', ['symbol' => $item['pair'], 'name' => $item['name']])), 'changefreq' => 'weekly', 'priority' => '0.8'];
                        }
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
