<?php


namespace AppBundle\Controller\Api;


use AppBundle\SDK\ApiClient;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\JsonResponse;

class MemberSpaceController extends BaseController
{
    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/secured", name="secured", options={"i18n"=false})
     * @throws \Exception
     */
    public function secureSpaceAction()
    {
        return new JsonResponse($this->get(ApiClient::class)->getUsers());
    }
}
