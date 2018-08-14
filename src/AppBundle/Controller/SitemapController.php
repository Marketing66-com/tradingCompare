<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 8/14/2018
 * Time: 3:50 PM
 */

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\BrowserKit\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;

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

        $urls[] = ['loc' => $this->get('router')->generate('crypto'), 'changefreq' => 'weekly', 'priority' => '1.0'];
        $urls[] = ['loc' => $this->get('router')->generate('forex'), 'changefreq' => 'weekly', 'priority' => '1.0'];
        $urls[] = ['loc' => $this->get('router')->generate('commodities'), 'changefreq' => 'weekly', 'priority' => '1.0'];
        $urls[] = ['loc' => $this->get('router')->generate('stock'), 'changefreq' => 'weekly', 'priority' => '1.0'];


        return $this->render('sitemap.xml.twig', [
            'urls' => $urls,
            'hostname' => $hostname
        ]);
    }
}