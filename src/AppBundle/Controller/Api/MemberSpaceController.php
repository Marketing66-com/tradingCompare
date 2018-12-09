<?php


namespace AppBundle\Controller\Api;


use AppBundle\Entity\User;
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

    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/get-sentiments-by-user", name="api_get_sentiments_by_user", options={"i18n"=false})
     * @return JsonResponse
     * @throws \Exception
     */
    public function getSentimentsByUser()
    {
        /** @var User $user */
        $user = $this->getUser();

        $sentiments = $this->get(ApiClient::class)->getSentimentsByUser($user->getIdentifier());
        return new JsonResponse($sentiments);
    }
}
