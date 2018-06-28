<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 6/26/2018
 * Time: 4:20 PM
 */

namespace AppBundle\Controller;


use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class BarController extends Controller
{
    public function barAction()
    {
        $api =  $this->getParameter('crypto_api');
//        $api_crypto = 'https://crypto-ws.herokuapp.com/All-Froms-and-Prices';
        $api_forex = 'https://xosignals.herokuapp.com/api2/getTradingCompareByName/forex';
        $forex_from1 = "EUR"; $forex_to1 = "USD";
        $forex_from2 = "USD"; $forex_to2 = "JPY";
        $first = "BTC"; $second = "ETH"; $third = "BCH"; $fourth = "LTC"; $fifth = "XRP"; $sixth = "DASH";
        return $this->render('default\bar.html.twig',array("api_forex"=>$api_forex, "api_crypto"=> $api,
            "first"=>$first, "second"=>$second,  "third"=>$third,  "fourth"=>$fourth,  "fifth"=>$fifth,  "sixth"=>$sixth,
            "forex_from1"=> $forex_from1, "forex_to1"=> $forex_to1,
            "forex_from2"=> $forex_from2, "forex_to2"=> $forex_to2));
    }

}