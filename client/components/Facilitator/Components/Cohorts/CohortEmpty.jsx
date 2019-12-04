export default class CohortEmpty {
    constructor(props) {
        this.id = props.id || null;
        this.name = props.name || `New Cohort ${new Date().toISOString()}`;
        this.users = props.users || [];
        this.scenarios = props.scenarios || [];
    }
}
