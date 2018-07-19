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
        $imgS = $this->getParameter('stocks_img');
        $chart_link = "stocks_chart";
        return $this->render('LiveFeedBundle:Default:live_stocks.html.twig',array('api'=>$apiS, 'img'=>$imgS, "chart_link"=>$chart_link));

    }

    /**
     * @Route("/stockcurrencies/streaming-stock-rates-majors-social-sentiment", name="Live_rates_stocks")
     */
    public function StockAction()
    {
        $apiS =  $this->getParameter('stocks_api');
        $imgS = $this->getParameter('stocks_img');
        $chart_link = "stocks_chart";
        return $this->render('LiveFeedBundle:Default:live_stocks.html.twig',array('api'=>$apiS, 'img'=>$imgS, "chart_link"=>$chart_link));

    }

    /**
     * @Route("/cryptocurrencies/streaming-crypto-rates-majors-social-sentiment", name="Live_rates_crypto")
     */
    public function CryptoAction()
    {
        $api =  $this->getParameter('crypto_api');
        $img = $this->getParameter('crypto_img');
        $chart_link = "crypto_chart";
        return $this->render('LiveFeedBundle:Default:live_crypto.html.twig',array('api'=>$api,"img"=>$img, "chart_link"=>$chart_link));


    }


    /**
     * @Route("/currencies/streaming-forex-rates-majors-social-sentiment", name="Live_rates_forex")
     */
    public function ForexAction()
    {
        $apiF =  $this->getParameter('forex_api');
        $imgF = $this->getParameter('forex_img');
        $chart_link = "forex_chart";
        return $this->render('LiveFeedBundle:Default:live_forex.html.twig',array('api'=>$apiF, 'img'=>$imgF, "chart_link"=>$chart_link));

    }
    
}