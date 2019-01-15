<?php

namespace ChartiqBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class ChartiqController extends Controller
{
    /**
     * @Route("/chartiq", name="chartiq")
     **/
    public function indexAction()
    {
        return $this->render('ChartiqBundle:Default:sample-template-advanced.html.twig');
    }


    /**
     * @Route("/live-chart", name="live-chart")
     **/
    public function liveChartAction()
    {
        $crypto_api =  $this->getParameter('crypto_api');

        return $this->render('ChartiqBundle:Default/test-chart.html.twig', array("currency"=>'BTC', "from"=>'BTC', "to"=>'USD', "crypto_api"=>$crypto_api,
            "name"=>'Bitcoin', "symbol"=>'BTC_USD'));

        //return $this->render('ChartiqBundle:Default:index.html.twig');
    }
}
