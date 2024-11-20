export const PublicRouteComponent = ({ Route, Redirect, publicRoutes, Switch }: any) => {
  return (
    <>
      <Switch>
        <Redirect exact from="/account" to="/" />
        {publicRoutes.map((route: any, i: any) => {
          return <Route exact={true} path={route.path} component={route.component} key={i} />;
        })}
        <Redirect to="/" />
      </Switch>
    </>
  );
};
