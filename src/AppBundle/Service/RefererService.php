<?php
/**
 * Created by Evis Bregu <evis.bregu@gmail.com>.
 * Date: 11/16/18
 * Time: 8:21 PM
 */

namespace AppBundle\Service;


use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Symfony\Component\Routing\RouterInterface;

class RefererService
{
    /** @var RequestStack */
    private $requestStack;

    /** @var RouterInterface */
    private $router;

    public function __construct(RequestStack $requestStack, RouterInterface $router)
    {
        $this->requestStack = $requestStack;
        $this->router = $router;
    }

    public function getReferer()
    {
        $request = $this->requestStack->getMasterRequest();

        if (null === $request) {
            return '';
        }
        // Get referer url from headers
        $referer = (string)$request->headers->get('referer');

        // Get basepath. We need to substract this from $referer
        $basepath = $request->getSchemeAndHttpHost();

        // Substract basepath from referer url
        $lastPath = substr($referer, strpos($referer, $basepath));
        $lastPath = str_replace($basepath, '', $lastPath);

        // Try to find a route from referer lastpath
        try {
            // get last route
            $parameters = $this->router->match($lastPath);

            // set new locale (to session and to the route parameters)
            $parameters['_locale'] = $request->get('langCode');
            $request->getSession()->set('_locale', $request->get('langCode'));

            // default parameters has to be unsetted!
            $route = $parameters['_route'];
            unset($parameters['_route']);
            unset($parameters['_controller']);

            return $route;

        } catch (ResourceNotFoundException $e) {
            // return empty if no route found
            return '';
        }
    }

}
