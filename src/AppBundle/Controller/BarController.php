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
        $api_crypto =  $this->getParameter('crypto_api');
        $api_forex =  $this->getParameter('forex_api');
        $api_stock =  $this->getParameter('stocks_api');

        $forex_from1 = "EUR"; $forex_to1 = "USD";
        $forex_from2 = "USD"; $forex_to2 = "JPY";

        $crypto_from1 = "BTC"; $crypto_to1 = "USD";
        $crypto_from2 = "ETH"; $crypto_to2 = "USD";

        $stock1 = "FB";
        $stock2 = "AAPL";

        return $this->render('default\bar.html.twig',array(
            "api_forex"=>$api_forex,
            "api_crypto"=> $api_crypto,
            "api_stock"=> $api_stock,

            "forex_from1"=> $forex_from1, "forex_to1"=> $forex_to1,
            "forex_from2"=> $forex_from2, "forex_to2"=> $forex_to2,

            "crypto_from1"=>$crypto_from1,  "crypto_to1"=>$crypto_to1,
            "crypto_from2"=>$crypto_from2, "crypto_to2"=>$crypto_to2,

            "stock1"=>$stock1,
            "stock2"=>$stock2,

           ));
    }

}