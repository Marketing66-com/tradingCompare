<?php


namespace AppBundle\Controller\Api;


use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\JsonResponse;

class MemberSpaceController extends BaseController
{
    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/secured", name="secured", options={"i18n"=false})
     */
    public function secureSpaceAction()
    {
        return new JsonResponse(['OK']);
    }
}
