import { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default function checkAuth(ComponentToProtect: any) {  
  return class extends Component {
    constructor(props: any) {
      super(props);
      this.state = {
        loading: true,
        redirect: false,
      };
    }    componentDidMount() {
      fetch('/check-auth')
        .then(res => {
          if (res.status === 200) {
            this.setState({ loading: false });
          } else {
            const error = res;
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, redirect: true });
        });
    }    render() {
      const { loading, redirect }: any = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }
      return <ComponentToProtect {...this.props} />;
    }
  }}