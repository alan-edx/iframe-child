export const GeneralRouteComponent = ({ Route, Redirect, generalRoutes, Switch }: any) => {
  return (
    <Switch>
      {generalRoutes.map((route: any, i: number) => {
        return <Route exact={true} path={route.path} component={route.component} key={i} />;
      })}
      <Redirect from="**" to="/" />
    </Switch>
  );
};
