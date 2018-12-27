<?php


namespace AppBundle\Controller\Api;


use AppBundle\Entity\User;
use AppBundle\SDK\ApiClient;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


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
     * @Route("/send-user-verify-code", name="api_send-user-verify-code", options={"i18n"=false})
     * @Method("POST")
     * @return JsonResponse
     * @throws \Exception
     */
    public function SendVerifyCode(Request $request)
    {
        $content = $request->getContent();
        $data = json_decode($content, true);
        $response= $this->get(ApiClient::class)->sendVerifyCode($data);
        return new JsonResponse($response);
    }

    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/update_fields", name="update_fields", options={"i18n"=false})
     * @Method("POST")
     * @return JsonResponse
     * @throws \Exception
     */
    public function update_fields(Request $request)
    {
        $content = $request->getContent();
        $data = json_decode($content, true);
        $response= $this->get(ApiClient::class)->updateFields($data);
        return new JsonResponse($response);
    }

    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/check_code", name="check_code", options={"i18n"=false})
     * @Method("POST")
     * @return JsonResponse
     * @throws \Exception
     */
    public function check_code(Request $request)
    {
        $content = $request->getContent();
        $data = json_decode($content, true);
        $response= $this->get(ApiClient::class)->check_code($data);
        return new JsonResponse($response);
    }

    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/get-user-by-id", name="get-user-by-id", options={"i18n"=false})
     * @Method("POST")
     * @return JsonResponse
     * @throws \Exception
     */
    public function get_user_by_id(Request $request)
    {
        $content = $request->getContent();
        $data = json_decode($content, true);
        $response= $this->get(ApiClient::class)->getUserById($data);
        return new JsonResponse($response);
    }

    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/add-to-watchlist", name="add-to-watchlist", options={"i18n"=false})
     * @Method("POST")
     * @return JsonResponse
     * @throws \Exception
     */
    public function add_to_watchlist(Request $request)
    {
        $content = $request->getContent();
        $data = json_decode($content, true);
        $response= $this->get(ApiClient::class)->addToWatchlist($data);
        return new JsonResponse($response);
    }

    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/delete-from-watchlist", name="delete-from-watchlist", options={"i18n"=false})
     * @Method("POST")
     * @return JsonResponse
     * @throws \Exception
     */
    public function delete_to_watchlist(Request $request)
    {
        $content = $request->getContent();
        $data = json_decode($content, true);
        $response= $this->get(ApiClient::class)->deleteFromWatchlist($data);
        return new JsonResponse($response);
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

    /**
     * @Security("is_granted('ROLE_USER')")
     * @Route("/add-sentiment", name="add-sentiment", options={"i18n"=false})
     * @Method("POST")
     * @return JsonResponse
     * @throws \Exception
     */
    public function add_sentiment(Request $request)
    {
        $content = $request->getContent();
        $data = json_decode($content, true);
        $response= $this->get(ApiClient::class)->addSentiment($data);
        return new JsonResponse($response);
    }

}
