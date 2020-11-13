import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import ProfileForm from '../screens/ProfileForm';
import QuizScreen from '../screens/QuizScreen';

const QuizStack = createStackNavigator();


const AppNavigator = props => {
    return (
        <NavigationContainer>
            <QuizStack.Navigator>
                {/* Profile Information screen */}
                <QuizStack.Screen
                    name='profileForm'
                    component={ProfileForm}
                    options={{
                        title: 'Profile Information',
                        headerStyle: {
                            backgroundColor: '#2196f3',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                />
                {/* The Quiz Screen */}
                <QuizStack.Screen
                    name='quizScreen'
                    component={QuizScreen}
                    options={{
                        title: 'Quiz',
                        headerStyle: {
                            backgroundColor: '#2196f3',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}

                />
            </QuizStack.Navigator>

        </NavigationContainer>
    );
};

export default AppNavigator;