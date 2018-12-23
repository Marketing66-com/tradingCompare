<?php

/**
 * (c) Evis Bregu <evis.bregu@gmail.com>.
 */

namespace AppBundle\Security;

use AppBundle\Api\ApiProblem;
use AppBundle\Api\ResponseFactory;
use AppBundle\Entity\User;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

class JwtTokenAuthenticator extends AbstractGuardAuthenticator
{
    /**
     * @var EntityRepository
     */
    private $userRepository;
    /**
     * @var ResponseFactory
     */
    private $responseFactory;
    /**
     * @var EntityManager
     */
    private $entityManager;
    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(EntityManager $entityManager, ResponseFactory $responseFactory, LoggerInterface $logger)
    {
        $this->responseFactory = $responseFactory;
        $this->entityManager = $entityManager;
        $this->userRepository = $this->entityManager->getRepository(User::class);
        $this->logger = $logger;
    }

    public function start(Request $request, AuthenticationException $authException = null)
    {
        // called when authentication info is missing from a
        // request that requires it

        $apiProblem = new ApiProblem(401);
        $message = $authException ? $authException->getMessageKey() : 'Missing credentials';
        $apiProblem->set('detail', $message);

        return $this->responseFactory->createResponse($apiProblem);
    }

    public function getCredentials(Request $request)
    {
        $extractor = new AuthorizationHeaderTokenExtractor(
            'Bearer',
            'Authorization'
        );
        $token = $extractor->extract($request);

        if (!$token) {
            /* @noinspection PhpInconsistentReturnPointsInspection */
            return;
        }

        return $token;
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        JWT::$leeway += 10;
        $content = file_get_contents("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com");
        $kids = json_decode($content, true);

        try {
            $jwt = JWT::decode($credentials, $kids, array('RS256'));
        } catch (ExpiredException $e) {
            throw new CustomUserMessageAuthenticationException('Invalid Token');
        }

        //$fbpid = property_exists($this, 'firebaseProjectId') ? $this->firebaseProjectId : config('vinkas.firebase.auth.project_id');
        //$issuer = 'https://securetoken.google.com/' . $fbpid;

        if(empty($jwt->sub)) {
            throw new CustomUserMessageAuthenticationException('Invalid Token');
        }
        $this->logger->error(print_r($jwt, true));
        $uid = $jwt->sub;

        $user = $this->userRepository->findOneBy(['identifier' => $uid]);

        // If the user is not found in db it means that this is the first sign in. Save the user.
        if(!$user) {
            $user = new User();

            if (property_exists($jwt, 'name')) {
                $name = $jwt->name;
            } else {
                $name = 'anonymous';
            }

            if (property_exists($jwt, 'picture')) {
                $picture = $jwt->picture;
            } else {
                $picture = '';
            }

            $user->setName($name)
                ->setEmail($jwt->email)
                ->setIdentifier($uid)
                ->setPicture($picture);

            $this->entityManager->persist($user);
            $this->entityManager->flush();
        }

        return $user;
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        return true;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $apiProblem = new ApiProblem(401);
        $apiProblem->set('detail', $exception->getMessageKey());

        return $this->responseFactory->createResponse($apiProblem);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        // do nothing - let the controller be called
    }

    public function supportsRememberMe()
    {
        return false;
    }
}
