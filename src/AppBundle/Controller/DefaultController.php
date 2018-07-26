<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    
     /**
     * @Route("/Crypto-currencies/{currency}/real-time-price-sentiment", name="crypto_chart", options={"expose" = true})
     */
    public function crypto_chartAction($currency)
    {
        $pair = explode("_", $currency);
        $from =  $pair[0];
        $to =  $pair[1];
        $api =  $this->getParameter('crypto_api');
        $like = $this->getParameter('crypto_likes');

        return $this->render('default/chart_crypto.html.twig', array("currency"=>$from,"from"=>$from, "to"=>$to, "api"=>$api,"like"=>$like));
    }

    /**
     * @Route("/currencies/{currency}/chart-real-time-sentiment", name="forex_chart", options={"expose" = true})
     */
    public function forex_chartAction($currency)
    {
        $apiF =  $this->getParameter('forex_api');
        $likeF = $this->getParameter('forex_likes');
        $from = substr($currency, 0, 3);
        $to =  substr($currency, 3, 5);
        $pair = $from."_".$to;
        return $this->render('default/chart_forex.html.twig',array("currency"=>$pair,'api'=>$apiF, 'like'=>$likeF));
    }

    /**
     * @Route("/equities/price/{currency}", name="stock_chart", options={"expose" = true})
     */
    public function stock_chartAction($currency)
    {
        $apiStock =  $this->getParameter('stocks_api');
        $likeS = $this->getParameter('stocks_likes');

        return $this->render('default/chart_stock.html.twig',array("currency"=>$currency,'api'=>$apiStock, 'like'=>$likeS,));
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
        return $this->render('default/review_Etoro.html.twig');
    }


    /**
     * @Route("/commodities", name="commodities")
     */
    public function commoditiAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/broker_commodities.html.twig');
    }

    /**
     * @Route("/crypto", name="crypto")
     */
    public function cryptoAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/broker_crypto.html.twig');
    }

    /**
     * @Route("/commodities2", name="commodities2")
     */
    public function commodities2Action()
    {
        // replace this example code with whatever you need
        return $this->render('default/broker_commodities2.html.twig');
    }

    /**
     * @Route("/forex2", name="forex2")
     */
    public function forex2Action()
    {
        // replace this example code with whatever you need
        return $this->render('default/broker_forex2.html.twig');
    }

    /**
     * @Route("/stocks2", name="stocks2")
     */
    public function stocks2Action()
    {
        // replace this example code with whatever you need
        return $this->render('default/broker_stocks2.html.twig');
    }

    /**
     * @Route("/Term-and-conditions", name="terms")
     */
    public function TermsAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/Term&Conditions.html.twig');
    }

    /**
     * @Route("/Privacy-policy", name="privacy")
     */
    public function privacyAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/PrivacyPolicy.html.twig');
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * @Route("/test", name="test")
     */
    public function testAction()
    {
        // replace this example code with whatever you need
        return $this->render('test.html.twig');
    }



    /**
     * @Route("/indexation", name="indexation")
     */
    public function indexationAction()
    {
//        $api =  $this->getParameter('crypto_api');
//        $img = $this->getParameter('crypto_img');
//        $chart_link = "crypto_chart";
//        return $this->render('default/indexation.html.twig',array('api'=>$api,"img"=>$img, "chart_link"=>$chart_link));

        return $this->render('default/indexation.html.twig');
    }

    /**
     * @Route("/ho_no", name="ho_no")
     */
    public function ho_noAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/ho_no.html.twig');
    }

    /**
     * @Route("/cryptocurrencies", name="cryptocurrencies")
     */
    public function cryptocurrenciesAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/broker_cryptocurrencies.html.twig');
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

//    /**
//     * @Route("/aaa/{from}_{to}", name="aaa")
//     */
//    public function aaanAction($from,$to)
//    {
////        $from = "ETH";
////        $to = "USD";
////        $exchange = "Coinbase";
////        $name = "Ethereum";
//
//        return $this->render('default/chart_crypto.html.twig', array("currency"=>$from,"from"=>$from, "to"=>$to));
//    }


}
