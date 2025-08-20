import { render, screen } from "@testing-library/react";
import React from "react";
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import WeeklyPlanning from '../modules/plannings/components/WeeklyPlanning';

describe("WeeklyPlanning Color Tests", () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    const mockState = {
        staff: {
            staffList: [
                { id: 1, name: 'John Doe', level: 3 },
                { id: 2, name: 'Jane Smith', level: 2 }
            ]
        },
        plannings: {
            weeklyPlanning: {
                weeklyPlanningDtos: [
                    {
                        name: 'John Doe',
                        colors: ['PARED', 'AMARILLO', 'COLON', 'ROJOS', 'URGENCIAS'], // 5 different colors
                        assignations: [null, null, null, null, null],
                        eveningAssignations: [null, null, null, null, null],
                        notValidAssignations: [[], [], [], [], []]
                    },
                    {
                        name: 'Jane Smith', 
                        colors: ['COLON', 'PARED', 'MAMA', 'NUTRI', 'RAYOS'], // 5 different colors
                        assignations: [null, null, null, null, null],
                        eveningAssignations: [null, null, null, null, null],
                        notValidAssignations: [[], [], [], [], []]
                    }
                ],
                activities: [[], [], [], [], []]
            },
            weeklyPlanningList: []
        }
    };

    it("should use first day color for person name cell", () => {
        const store = mockStore(mockState);
        
        render(
            <Provider store={store}>
                <WeeklyPlanning />
            </Provider>
        );

        // The person name cell should have background color based on first day color (colors[0])
        // John Doe: colors[0] = 'PARED' -> should map to '#4CAF50'
        // Jane Smith: colors[0] = 'COLON' -> should map to '#2196F3' 
        
        const johnCell = screen.getByText('John Doe');
        expect(johnCell).toHaveStyle('background-color: rgb(76, 175, 80)'); // #4CAF50
        
        const janeCell = screen.getByText('Jane Smith');
        expect(janeCell).toHaveStyle('background-color: rgb(33, 150, 243)'); // #2196F3
    });

    it("should handle empty colors array gracefully", () => {
        const stateWithNullColors = {
            ...mockState,
            plannings: {
                ...mockState.plannings,
                weeklyPlanning: {
                    ...mockState.plannings.weeklyPlanning,
                    weeklyPlanningDtos: [
                        {
                            name: 'Test User',
                            colors: null, // null colors array
                            assignations: [null, null, null, null, null],
                            eveningAssignations: [null, null, null, null, null],
                            notValidAssignations: [[], [], [], [], []]
                        }
                    ]
                }
            }
        };
        
        const store = mockStore(stateWithNullColors);
        
        render(
            <Provider store={store}>
                <WeeklyPlanning />
            </Provider>
        );

        // Should fallback to white color (#fff) when colors array is null
        const testUserCell = screen.getByText('Test User');
        expect(testUserCell).toHaveStyle('background-color: rgb(255, 255, 255)'); // #fff
    });
});