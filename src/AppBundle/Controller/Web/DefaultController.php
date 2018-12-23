<?php

namespace AppBundle\Controller\Web;

use AppBundle\Service\RefererService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\BrowserKit\Response;

use AppBundle\Service\MessageGenerator;

class DefaultController extends Controller
{
    /**
     *  * @Route("/firebaseui", name="firebase", options={"i18n"=false})
     */
    public function firebasuiAction()
    {
        return $this->render('firebaseui.html.twig');
    }

    /**
     *  * @Route("/sample_page", name="sample_firebase_angular", options={"i18n"=false})
     */
    public function samplePageAction(MessageGenerator $messageGenerator)
    {
        return $this->render(':default:sample_page.html.twig');
    }


    /**
     *
     * @Route("/changelanguage/{langCode}", name="changelanguage")
     * @Method("GET")
     *
     * @param                $langCode
     * @param Request        $request
     *
     * @param RefererService $refererService
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function changelanguageAction($langCode, Request $request, RefererService $refererService) {

        // redirect to previous route
        $prevRouteParameters = $refererService->getReferer();

        $prevRoute = $prevRouteParameters['_route'];
        // default parameters has to be unsetted!
        unset($prevRouteParameters['_route']);
        unset($prevRouteParameters['_controller']);

        if ($prevRoute == '' || $prevRoute == 'homepage') {
            $prevRoute = 'localised_home';
        }

        $prevRouteParameters['_locale'] = $langCode;

        return $this->redirect(
            $this->generateUrl(
                $prevRoute,
                $prevRouteParameters
            )

        );

    }

//********************************  CHART   ********************************

     /**
     * @Route("/{name}/{currency}/cryptocurrency-price", name="crypto_chart", options={"expose" = true})
     */
    public function crypto_chartAction($name,$currency)
    {
        $pair = explode("_", $currency);
        $from =  $pair[0];
        $to =  $pair[1];
        $my_name = ucfirst(str_replace("-", " ", $name));

        $crypto_api =  $this->getParameter('crypto_api');

        return $this->render('default/chart_crypto.html.twig', array("currency"=>$from, "from"=>$from, "to"=>$to, "crypto_api"=>$crypto_api, "name"=>$my_name, "symbol"=>$currency));
       //return $this->render('default/charttest.html.twig', array("currency"=>$from, "from"=>$from, "to"=>$to, "crypto_api"=>$crypto_api,"crypto_likes"=>$crypto_likes));
    }

    /**
     * @Route("/{currency}/forex-price", name="forex_chart", options={"expose" = true})
     */
    public function forex_chartAction($currency)
    {
        $from = substr($currency, 0, 3);
        $to =  substr($currency, 4, 6);
        $pair = str_replace("-", "_", $currency);
        return $this->render('default/chart_forex.html.twig',array("currency"=>$pair, "from"=>$from , "to"=>$to, "symbol"=>$from));
    }

    /**
     * @Route("/{symbol}/{name}/stock-price", name="stock_chart", options={"expose" = true})
     */
    public function stock_chartAction($symbol,$name)
    {
        $my_name = ucfirst(str_replace("-", " ", $name));
        return $this->render('default/chart_stock.html.twig',array("symbol"=>$symbol, 'name'=>$my_name));
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
//        $petsJson = file_get_contents('js/countries.json');
//        $pets = json_encode($petsJson);
//        $hello="hello";
//        return $this->render('base.html.twig',array("json"=>$pets));
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


//    /**
//     * @Route("/ho_no", name="ho_no")
//     */
//    public function ho_noAction()
//    {
//        // replace this example code with whatever you need
//        return $this->render('default/ho_no.html.twig');
//    }

//    /**
//     * @Route("/commentOnChart", name="commentOnChart")
//     */
//    public function commentOnChartAction()
//    {
////        $pair = 'BTC_USD';
////        $from =  'BTC';
////        $to =  'USD';
////        $my_name = 'Bitcoin';
////
////        $crypto_api =  $this->getParameter('crypto_api');
////        return $this->render('default/chart_crypto.html.twig', array("currency"=>$from, "from"=>$from, "to"=>$to, "crypto_api"=>$crypto_api, "name"=>$my_name));
//        $symbol = 'FB';
//        return $this->render('default/social_tab.html.twig',array("symbol"=>$symbol));
//    }


    /**
     * @Route("/autocomplete", name="autocomplete")
     */
    public function autocompleteAction()
    {
        return $this->render('default/test/signup.html.twig');
    }



//    /**
//     * @Route("/{name}/{currency}/cryptotest", name="cryptotest", options={"expose" = true})
//     */
//    public function cryptotestAction($name,$currency)
//    {
//        $pair = explode("_", $currency);
//        $from =  $pair[0];
//        $to =  $pair[1];
//        $my_name = ucfirst(str_replace("-", " ", $name));
//
//        $crypto_api =  $this->getParameter('crypto_api');
//
//        return $this->render('default/test_chart_crypto.html.twig', array("currency"=>$from, "from"=>$from, "to"=>$to, "crypto_api"=>$crypto_api, "name"=>$my_name));
//    }
//
//    /**
//     * @Route("/{currency}/forextest", name="forextest", options={"expose" = true})
//     */
//    public function forextestchartAction($currency)
//    {
////        $apiF =  $this->getParameter('forex_api');
////        $likeF = $this->getParameter('forex_likes');
//        $from = substr($currency, 0, 3);
//        $to =  substr($currency, 4, 6);
//        $pair = str_replace("-", "_", $currency);
////        return $this->render('default/test_chart_forex.html.twig',array("currency"=>$pair, "from"=>$from , "to"=>$to ,'api'=>$apiF, 'like'=>$likeF));
//        return $this->render('default/test_chart_forex.html.twig',array("currency"=>$pair, "from"=>$from , "to"=>$to));
//    }
//
//    /**
//     * @Route("/{symbol}/{name}/stocktest", name="teststock_chart", options={"expose" = true})
//     */
//    public function test_stock_chartAction($symbol,$name)
//    {
//        $my_name = ucfirst(str_replace("-", " ", $name));
//        return $this->render('default/test_chart_stock.html.twig',array("symbol"=>$symbol, 'name'=>$my_name));
//    }
}
