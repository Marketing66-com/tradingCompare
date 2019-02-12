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

class FeedsController extends Controller
{
    /**
     * @Route("/", name="localised_home")
     */
    public function HomeAction()
    {
        $country_name = "United States" ;
        $country_value = "united-states-of-america";
        return $this->render('LiveFeedBundle:Default:live_stock.html.twig',
        array("country_name"=>$country_name, "country_value"=>$country_value));
    }

    /**
     * @Route("/stock-market/{name}/{value}", name="Live_rates_stocks", options={"expose" = true})
     */
    public function StockAction($name, $value)
    {
        $country_name = ucfirst(str_replace("-", " ", $name));

        if($value == 'flag-general')
          $country_value = str_replace("-", " ", $value);
        else
          $country_value = $value;

        return $this->render('LiveFeedBundle:Default:live_stock.html.twig',
            array("country_name"=>$country_name, "country_value"=>$country_value));
    }

    /**
     * @Route("/cryptocurrency-prices", name="Live_rates_crypto")
     */
    public function CryptoAction()
    {
        $crypto_api =  $this->getParameter('crypto_api');
        return $this->render('LiveFeedBundle:Default:live_crypto.html.twig',array('crypto_api'=>$crypto_api));
    }


    /**
     * @Route("/forex-rates", name="Live_rates_forex")
     */
    public function ForexAction()
    {
        return $this->render('LiveFeedBundle:Default:live_forex.html.twig',array());

    }
    
}
