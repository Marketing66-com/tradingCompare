<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{


//********************************  CHART   ********************************

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



//********************************  BROKERS  ********************************

    /**
     * @Route("/template",name="template")
     */
    public function templateAction()
    {

        return $this->render('default/brokers_template.html.twig');
    }

    /**
     * @Route("/crypto-brokers",name="crypto")
     */
    public function brokercryptoAction()
    {

        return $this->render('default/brokers_crypto.html.twig');
    }

    /**
     * @Route("/forex-brokers",name="forex")
     */
    public function brokerforexAction()
    {

        return $this->render('default/brokers_forex.html.twig');
    }

    /**
     * @Route("/commodities-brokers",name="commodities")
     */
    public function brokercomAction()
    {

        return $this->render('default/brokers_commodities.html.twig');
    }
    /**
     * @Route("/stock-brokers",name="stock")
     */
    public function brokerstockAction()
    {

        return $this->render('default/brokers_stocks.html.twig');
    }


    //********************************  REVIEWS  ******************************************


    /**
     * @Route("/broker-review/etoro", name="etoro")
     */
    public function etoroAction()
    {

        return $this->render('default/review_Etoro.html.twig');
    }

    /**
     * @Route("/broker-review/24options", name="24option")
     */
    public function optionAction()
    {

        return $this->render('default/review_24option.html.twig');
    }

    /**
     * @Route("/broker-review/trade-com", name="trade")
     */
    public function tradeAction()
    {

        return $this->render('default/review_Trade.html.twig');
    }

    /**
     * @Route("broker-review/plus500", name="plus500")
     */
    public function plusAction()
    {

        return $this->render('default/review_Plus500.html.twig');
    }

    /**
     * @Route("broker-review/Pepperstone", name="pepperstone")
     */
    public function pepperstoneAction()
    {

        return $this->render('default/review_pepperstone.html.twig');
    }


    /**
     * @Route("broker-review/Alvexo ", name="alvexo")
     */
    public function alvexoAction()
    {

        return $this->render('default/review_alvexo.html.twig');
    }


    /**
     * @Route("broker-review/Markets-com", name="market")
     */
    public function marketAction()
    {

        return $this->render('default/review_market.html.twig');
    }


    //********************************  BASE - TERMS - PRIVACY   ********************************
    /**
     * @Route("/new")
     */
    public function HomeAction()
    {

        return $this->render('base.html.twig');
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


    /**
     * @Route("/ho_no", name="ho_no")
     */
    public function ho_noAction()
    {
        // replace this example code with whatever you need
        return $this->render('default/ho_no.html.twig');
    }

    /**
     * @Route("/test/{currency}")
     */
    public function testAction($currency)
    {
        $pair = explode("_", $currency);
        $from =  $pair[0];
        $to =  $pair[1];
        $api =  $this->getParameter('crypto_api');
        $like = $this->getParameter('crypto_likes');

        return $this->render('default/charttest.html.twig', array("currency"=>$from,"from"=>$from, "to"=>$to, "api"=>$api,"like"=>$like));
//        return $this->render('default/charttest.html.twig');
    }


}
