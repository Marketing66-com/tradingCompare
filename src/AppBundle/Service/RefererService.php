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
        $this->router       = $router;
    }

    public function getReferer()
    {
        $request = $this->requestStack->getMasterRequest();

        if (null === $request)
        {
            return '';
        }

        $uri = (string)$request->headers->get('referer');

        //but if you want to return route, here you go
        try
        {
            $routeMatch = $this->router->match($uri);
        }
        catch (ResourceNotFoundException $e)
        {
            return '';
        }

        $route = $routeMatch['_route'];

        return $route;
    }

}
