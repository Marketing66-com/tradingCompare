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



class BarController extends Controller
{
    public function barAction()
    {
        $api =  $this->getParameter('crypto_api');
        $first = "BTC"; $second = "ETH"; $third = "BCH"; $fourth = "LTC"; $fifth = "XRP"; $sixth = "DASH";
        return $this->render('default\bar.html.twig',array("api"=>$api, "first"=>$first, "second"=>$second,  "third"=>$third,  "fourth"=>$fourth,  "fifth"=>$fifth,  "sixth"=>$sixth));
    }

}