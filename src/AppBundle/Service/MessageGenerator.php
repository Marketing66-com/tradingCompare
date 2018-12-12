<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 12/9/2018
 * Time: 5:54 PM
 */

namespace AppBundle\Service;


class MessageGenerator
{
    public function getHappyMessage()
    {
        $messages = [
            'You did it! You updated the system! Amazing!',
            'That was one of the coolest updates I\'ve seen all day!',
            'Great work! Keep going!',
        ];
        
        return $messages;
        
    }
}