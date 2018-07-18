<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{

    /**
     * @Route("/cryptocurrencies", name="cryptocurrencies")
     */
    public function cryptocurrenciesAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/cryptocurrencies.html.twig');
    }


//    /**
//     * @Route("/forex", name="forex")
//     */
//    public function forexAction(Request $request)
//    {
//        // replace this example code with whatever you need
//        return $this->render('default/forex.html.twig');
//    }

//    /**
//     * @Route("/stocks", name="stocks")
//     */
//    public function stocksAction(Request $request)
//    {
//        // replace this example code with whatever you need
//        return $this->render('default/stocks.html.twig');
//    }

//    /**
//     * @Route("/commodities", name="commodities")
//     */
//    public function commoditiesAction(Request $request)
//    {
//        // replace this example code with whatever you need
//        return $this->render('default/commodities.html.twig');
//    }


    /**
     * @Route("/test", name="test")
     */
    public function testAction()
    {
        // replace this example code with whatever you need
        return $this->render('test.html.twig');
    }


    /**
     * @Route("/mybar", name="mybar")
     */
    public function mybarAction()
    {
//        $api =  $this->getParameter('crypto_api');
        $api = 'https://crypto-ws.herokuapp.com/All-Froms-and-Prices';
        $first = "BTC"; $second = "ETH"; $third = "BCH"; $fourth = "LTC"; $fifth = "XRP"; $sixth = "DASH";
        return $this->render('default\bar.html.twig',array("api"=>$api, "first"=>$first, "second"=>$second,  "third"=>$third,  "fourth"=>$fourth,  "fifth"=>$fifth,  "sixth"=>$sixth));
    }

    /**
     * @Route("/ho_no", name="ho_no")
     */
    public function ho_noAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/ho_no.html.twig');
    }

//    /**
//     * @Route("/Live_rates_stocks", name="Live_rates_stocks")
//     */
//    public function Live_rates_stocksAction()
//    {
//        // replace this example code with whatever you need
//        return $this->render('default/Live_rates_stocks.html.twig');
//    }


    /**
     * @Route("/chart", name="chart")
     */
    public function chartAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/chart.html.twig');
    }



//    /**
//     * @Route("/Crypto-currencies/{currency}/real-time-price-sentiment", name="crypto_chart", options={"expose" = true})
//     */
//    public function crypto_chartAction($currency)
//    {
//        return $this->render('default/chart_crypto.html.twig',array("currency"=>$currency));
//    }

    /**
     * @Route("/Crypto-currencies/{currency}/real-time-price-sentiment", name="crypto_chart", options={"expose" = true})
     */
    public function crypto_chartAction($currency)
    {
        $pair = explode("_", $currency);
        $from =  $pair[0];
        $to =  $pair[1];
        $api =  $this->getParameter('crypto_api');
        $img = $this->getParameter('crypto_img');

        return $this->render('default/test_chart.html.twig', array("currency"=>$from,"from"=>$from, "to"=>$to, "api"=>$api,"img"=>$img));
    }

    /**
     * @Route("/aaa/{from}_{to}", name="aaa")
     */
    public function aaanAction($from,$to)
    {
//        $from = "ETH";
//        $to = "USD";
//        $exchange = "Coinbase";
//        $name = "Ethereum";

        return $this->render('default/test_chart.html.twig', array("currency"=>$from,"from"=>$from, "to"=>$to));
    }


    /**
     * @Route("/currencies/{currency}/chart-real-time-sentiment", name="forex_chart", options={"expose" = true})
     */
    public function forex_chartAction($currency)
    {

        $from = substr($currency, 0, 3);
        $to =  substr($currency, 3, 5);
        $pair = $from."_".$to;
        return $this->render('default/forex_chart.html.twig',array("currency"=>$pair));
    }

//    /**
//     * @Route("/equities/price/{symbol}", name="stock_chart")
//     */
//    public function stock_chartAction($symbol)
//    {
//        dump($symbol);
//        // replace this example code with whatever you need
//        return $this->render('default/stock_chart.html.twig');
//    }

    /**
     * @Route("/equities/price/{currency}", name="stock_chart", options={"expose" = true})
     */
    public function stock_chartAction($currency)
    {

        // replace this example code with whatever you need
        return $this->render('default/stock_chart.html.twig',array("currency"=>$currency,));
    }



    /**
     * @Route("/broker_review", name="broker_review")
     */
    public function broker_reviewAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/broker_review.html.twig');
    }

    /**
     * @Route("/etoro_review", name="etoro_review")
     */
    public function etoro_reviewAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/Etoro_review.html.twig');
    }

    /**
     * @Route("/commodities2", name="commodities2")
     */
    public function commodities2Action()
    {
        // replace this example code with whatever you need
        return $this->render('default/commodities2.html.twig');
    }

    /**
     * @Route("/commodities", name="commodities")
     */
    public function commoditiAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/commodities.html.twig');
    }


    /**
     * @Route("/crypto", name="crypto")
     */
    public function cryptoAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/crypto.html.twig');
    }





    /**
     * @Route("/forex2", name="forex2")
     */
    public function forex2Action()
    {
        // replace this example code with whatever you need
        return $this->render('default/forex2.html.twig');
    }

    /**
     * @Route("/stocks2", name="stocks2")
     */
    public function stocks2Action()
    {
        // replace this example code with whatever you need
        return $this->render('default/stocks2.html.twig');
    }

    /**
     * @Route("/detente", name="detente")
     */
    public function detenteAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/detente.html.twig');
    }

    /**
     * @Route("/indexation", name="indexation")
     */
    public function indexationAction()
    {
        $api =  $this->getParameter('crypto_api');
        $img = $this->getParameter('crypto_img');
        $chart_link = "crypto_chart";
        return $this->render('default/indexation.html.twig',array('api'=>$api,"img"=>$img, "chart_link"=>$chart_link));


    }



}
