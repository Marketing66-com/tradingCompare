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

}