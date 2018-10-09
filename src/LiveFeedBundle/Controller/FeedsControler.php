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
    {   $stocks_api =  $this->getParameter('stocks_api');
        $stocks_likes = $this-> getParameter('stocks_likes');
        $chart_link = "stocks_chart";
        $country_name = "United States" ;
        $country_value = "united-states-of-america";
        return $this->render('LiveFeedBundle:Default:live_stocks.html.twig',
            array('stocks_api'=>$stocks_api,  "chart_link"=>$chart_link, "stocks_likes"=>$stocks_likes, "country_name"=>$country_name, "country_value"=>$country_value));
    }

    /**
     * @Route("/stockcurrencies/streaming-stock-rates-majors-social-sentiment/{name}/{value}", name="Live_rates_stocks", options={"expose" = true})
     */
    public function StockAction($name, $value)
    {
        $stocks_api =  $this->getParameter('stocks_api');
        $stocks_likes = $this-> getParameter('stocks_likes');
        $chart_link = "stocks_chart";
        $country_name = $name ;
        $country_value = $value;
        return $this->render('LiveFeedBundle:Default:live_stocks.html.twig',
            array('stocks_api'=>$stocks_api,  "chart_link"=>$chart_link, "stocks_likes"=>$stocks_likes, "country_name"=>$country_name, "country_value"=>$country_value));

    }

    /**
     * @Route("/cryptocurrencies/streaming-crypto-rates-majors-social-sentiment", name="Live_rates_crypto")
     */
    public function CryptoAction()
    {
        $crypto_api =  $this->getParameter('crypto_api');
        $crypto_likes = $this-> getParameter('crypto_likes');

        return $this->render('LiveFeedBundle:Default:live_crypto.html.twig',array('crypto_api'=>$crypto_api, "crypto_likes"=>$crypto_likes));
    }


    /**
     * @Route("/currencies/streaming-forex-rates-majors-social-sentiment", name="Live_rates_forex")
     */
    public function ForexAction()
    {

        $apiF =  $this->getParameter('forex_api');
        //$imgF = $this->getParameter('forex_img');
        $likes = $this-> getParameter('forex_likes');
        $chart_link = "forex_chart";
        return $this->render('LiveFeedBundle:Default:live_forex.html.twig',array('api'=>$apiF,  "chart_link"=>$chart_link, "likes"=>$likes));

    }
    
}