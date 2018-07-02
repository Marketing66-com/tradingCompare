<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 6/24/2018
 * Time: 12:20 PM
 */

namespace LiveFeedBundle\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class FeedsControler extends Controller
{
    /**
     * @Route("/")
     */
    public function indexAction()
    {
        $api =  $this->getParameter('crypto_api');
        $img = $this->getParameter('crypto_img');
        $chart_link = "crypto_chart";
        dump($chart_link);
        return $this->render('LiveFeedBundle:Default:crypto.html.twig' ,array('api'=>$api,"img"=>$img, "chart_link"=>$chart_link));

    }


    /**
     * @Route("/Live_rates_crypto",name="Live_rates_crypto")
     */
    public function CryptoAction()
    {
        $api =  $this->getParameter('crypto_api');
        $img = $this->getParameter('crypto_img');
        $chart_link = "crypto_chart";
        return $this->render('LiveFeedBundle:Default:crypto.html.twig',array('api'=>$api,"img"=>$img, "chart_link"=>$chart_link));


    }



    /**
     * @Route("/Live_rates_forex",name="Live_rates_forex")
     */
    public function ForexAction()
    {
        $apiF =  $this->getParameter('forex_api');
        $imgF = $this->getParameter('forex_img');
        $chart_link = "forex_chart";
        return $this->render('LiveFeedBundle:Default:forex.html.twig',array('api'=>$apiF, 'img'=>$imgF, "chart_link"=>$chart_link));

    }

//    /**
//     * @Route("/bar",name="bar")
//     */
//    public function testAngularAction()
//    {
//
//        $api =  $this->getParameter('crypto_api');
//        $img = $this->getParameter('crypto_img');
//        $chart_link = "crypto_chart";
//        $first = "BTC";
////        return $this->render('LiveFeedBundle:Default:testAngular.html.twig',array('api'=>$api,"img"=>$img, "chart_link"=>$chart_link));
//        return $this->render('default\bar.html.twig',array('api'=>$api,  "first"=>$first, 'img'=>$img, "chart_link"=>$chart_link));
//
//
//    }



//    /**
//     * @Route("/testAngular",name="testAngular")
//     */
//    public function testAngular2Action()
//    {
//
//        $api =  $this->getParameter('crypto_api');
//        $img = $this->getParameter('crypto_img');
//        $chart_link = "crypto_chart";
//        $first = "BTC";
////        return $this->render('LiveFeedBundle:Default:testAngular.html.twig',array('api'=>$api,"img"=>$img, "chart_link"=>$chart_link));
//        return $this->render('LiveFeedBundle:Default:testAngular.html.twig',array('api'=>$api, 'img'=>$img, "chart_link"=>$chart_link));
//
//
//    }


}