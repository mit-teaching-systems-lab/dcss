import React from 'react';
import { List } from 'semantic-ui-react';

export default ({ view, results }) => {
    if (!results.length) {
        return null;
    }
    return results.map(record => {
        const {
            description,
            email,
            ended_at,
            id,
            title = '',
            username = ''
        } = record;
        return view === 'users' ? (
            <List.Item fluid="true" key={id}>
                <List.Header as="h3">{username}</List.Header>
                <List.Content>
                    {email}
                    <br />
                    Clicking (or not?) on this item should display controls for:
                    <ul>
                        <li>viewing this participant&apos;s runs.</li>
                        <li>initiating a session</li>
                    </ul>
                </List.Content>
            </List.Item>
        ) : (
            <List.Item fluid="true" key={id}>
                <List.Header as="h3">
                    {username} participated in &quot;{title}&quot; on {ended_at}
                </List.Header>
                <List.Content>
                    {description}
                    Clicking (or not?) on this item should display controls for:
                    <ul>
                        <li>viewing the responses collected for this run.</li>
                        <li>...</li>
                    </ul>
                </List.Content>
            </List.Item>
        );
    });
};
