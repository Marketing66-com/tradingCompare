<?php

namespace AppBundle\EventSubscriber;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Routing\RouteCollection;

class LocaleRewriteSubscriber implements EventSubscriberInterface
{
    /**
     * @var RouterInterface
     */
    private $router;

    /**
     * @var RouteCollection
     */
    private $routeCollection;

    /**
     * @var string
     */
    private $defaultLocale;


    public function __construct(RouterInterface $router, $defaultLocale = 'en')
    {
        $this->router = $router;
        $this->routeCollection = $router->getRouteCollection();
        $this->defaultLocale = $defaultLocale;
    }

    public function onKernelRequest(GetResponseEvent $event)
    {
        $request = $event->getRequest();
        $path = $request->getPathInfo();

        try {
            $params = $this->router->match($path);
        } catch (\Exception $e){
            $params = [];
        }

        // If the route is matched then we do not need to set locale. Just return and do nothing.
        if($params) {
            return;
        }

        // Add the locale to the path and test if we have a matching route
        $locale = $request->getLocale();
        $path = "/".$locale.$path;

        try {
            $params = $this->router->match($path);
        } catch (\Exception $e){
            $params = [];
        }

        //If we found a matching route then redirect.
        if($params){

            $prevRoute = $params['_route'];
            // default parameters has to be unsetted!
            unset($params['_route']);
            unset($params['_controller']);

            if ($prevRoute == '' || $prevRoute == 'homepage') {
                $prevRoute = 'localised_home';
            }

            $params['_locale'] = $locale;

            $response = new RedirectResponse(
                $this->router->generate($prevRoute, $params),
                301
            );

            $event->setResponse($response);
        }

        //Otherwise do nothing and continue on~
    }

    public static function getSubscribedEvents()
    {
        return array(
            // must be registered before the default Locale listener
            KernelEvents::REQUEST => array(array('onKernelRequest', 17)),
        );
    }
}
