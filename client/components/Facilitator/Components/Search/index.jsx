import React from 'react';
import {
    Container,
    Dropdown,
    Form,
    Grid,
    Icon,
    Input,
    List
} from 'semantic-ui-react';
import Search from '@client/components/Search';
import SearchResults from './SearchResults';
const availableViews = [
    {
        key: 'users',
        text: 'Participants',
        value: 'users'
    },
    {
        key: 'runs',
        text: 'Runs',
        value: 'runs'
    }
];

const defaultAvailableViewValue = availableViews[0].value;

class FacilitatorSearch extends Search {
    constructor(props) {
        super(props);

        this.timeout = null;
        this.state = {
            view: defaultAvailableViewValue,
            keyword: '',
            results: []
        };

        this.onChange = this.onChange.bind(this);
        this.onDropdownChange = this.onDropdownChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onDropdownChange(event, data = {}) {
        this.setState({
            view: data.value
        });
    }

    onChange(event, data = {}) {
        this.setState({
            keyword: data.value
        });

        this.onSubmit();
    }

    async onSubmit() {
        const { keyword, view } = this.state;
        if (keyword && keyword.length > 1 && view) {
            const response = await Search.query(view, { keyword });
            const { error, results } = response;
            if (error) {
                // TODO: implement error message display?
                // const { message, stack } = response;
                return;
            }
            this.setState({
                results
            });
        }
    }

    render() {
        const { onChange, onSubmit } = this;
        return (
            <Container fluid className="tm__editor-tab">
                <Grid columns={2} divided stackable>
                    <Grid.Column width={3}>
                        <Form
                            onSubmit={onSubmit}
                            className="facilitator-search__form"
                        >
                            <Form.Field>
                                <Dropdown
                                    fluid
                                    selection
                                    placeholder="Lookup..."
                                    options={availableViews}
                                    defaultValue={defaultAvailableViewValue}
                                    onChange={this.onDropdownChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="keyword">Keyword</label>
                                <Input
                                    name="keyword"
                                    value={this.state.keyword}
                                    icon={
                                        <Icon
                                            name="search"
                                            inverted
                                            circular
                                            link
                                            onClick={onChange}
                                        />
                                    }
                                    onChange={onChange}
                                />
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                    <Grid.Column stretched>
                        <List relaxed>
                            <SearchResults
                                view={this.state.view}
                                results={this.state.results}
                            />
                        </List>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

FacilitatorSearch.propTypes = {};

export default FacilitatorSearch;
