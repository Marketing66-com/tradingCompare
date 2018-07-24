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
    public function HomeAction()
    {  $apiS =  $this->getParameter('stocks_api');
//       $imgS = $this->getParameter('stocks_img');
        $likes = $this-> getParameter('stocks_likes');
       $chart_link = "stocks_chart";
       return $this->render('LiveFeedBundle:Default:live_stocks.html.twig',array('api'=>$apiS,  "chart_link"=>$chart_link, "likes"=>$likes));

    }

    /**
     * @Route("/stockcurrencies/streaming-stock-rates-majors-social-sentiment", name="Live_rates_stocks")
     */
    public function StockAction()
    {
        $apiS =  $this->getParameter('stocks_api');
//        $imgS = $this->getParameter('stocks_img');
        $likes = $this-> getParameter('stocks_likes');
        $chart_link = "stocks_chart";
        return $this->render('LiveFeedBundle:Default:live_stocks.html.twig',array('api'=>$apiS,  "chart_link"=>$chart_link, "likes"=>$likes));

    }

    /**
     * @Route("/cryptocurrencies/streaming-crypto-rates-majors-social-sentiment", name="Live_rates_crypto")
     */
    public function CryptoAction()
    {
        $api =  $this->getParameter('crypto_api');
//        $img = $this->getParameter('crypto_img');
        $likes = $this-> getParameter('crypto_likes');
        $chart_link = "crypto_chart";
        return $this->render('LiveFeedBundle:Default:live_crypto.html.twig',array('api'=>$api, "chart_link"=>$chart_link, "likes"=>$likes));


    }


    /**
     * @Route("/currencies/streaming-forex-rates-majors-social-sentiment", name="Live_rates_forex")
     */
    public function ForexAction()
    {
        $apiF =  $this->getParameter('forex_api');
//        $imgF = $this->getParameter('forex_img');
        $likes = $this-> getParameter('forex_likes');
        $chart_link = "forex_chart";
        return $this->render('LiveFeedBundle:Default:live_forex.html.twig',array('api'=>$apiF,  "chart_link"=>$chart_link, "likes"=>$likes));

    }
    
}