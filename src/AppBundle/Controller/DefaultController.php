<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\BrowserKit\Response;

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
        $crypto_api =  $this->getParameter('crypto_api');
        $crypto_likes = $this->getParameter('crypto_likes');

        return $this->render('default/chart_crypto.html.twig', array("currency"=>$from, "from"=>$from, "to"=>$to, "crypto_api"=>$crypto_api,"crypto_likes"=>$crypto_likes));
       //return $this->render('default/charttest.html.twig', array("currency"=>$from, "from"=>$from, "to"=>$to, "crypto_api"=>$crypto_api,"crypto_likes"=>$crypto_likes));
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
     * @Route("/equities/price/{currency}/{country}/{name}", name="stock_chart", options={"expose" = true})
     */
    public function stock_chartAction($currency, $country, $name)
    {
        $my_country = ucfirst(str_replace("-", " ", $country));
        $apiStock =  $this->getParameter('stocks_api');
        $likeS = $this->getParameter('stocks_likes');

        return $this->render('default/chart_stock.html.twig',array("currency"=>$currency, 'country'=>$my_country, 'name'=>$name, 'api'=>$apiStock,'like'=>$likeS,));
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
     * @Route("/pagination", name="pagination")
     */
    public function paginationAction()
    {
        return $this->render('indextest.html.twig');
    }


    /**
     * @Route("/autocomplete", name="autocomplete")
     */
    public function autocompleteAction()
    {
        return $this->render('default/autocompletetest.html.twig');
    }



//    /**
//     * @Route("/try", name="try")
//     */
//    public function tryAction()
//    {
//        $buzz = $this->container->get('buzz');
//
//        $response = $buzz->get('https://crypto-ws.herokuapp.com/All-Froms-and-Prices');
//
//        echo $response->getContent();
//    }


}
