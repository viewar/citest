import React from "react";
import { withRouter } from "react-router-dom";
import PagePropTypes from "src/PagePropTypes";
import Button from "components/Primitives/Button";
import useQueryState from "hooks/useQueryState";
import useViewarApi from "hooks/useViewarApi";
import { InferProps } from "prop-types";
import Icon from "components/Primitives/Icon";

function Info({ history }: InferProps<typeof Info.propTypes>) {
  const viewarApi = useViewarApi();

  const [infoVisible, setInfoVisible] = useQueryState("infoVisible", false);
  const [versionVisible, setVersionVisible] = useQueryState("versionVisible", false);

  const goBack = () => history.push("/");

  const toggleInfo = () => setInfoVisible(!infoVisible);
  const toggleVersion = () => setVersionVisible(!versionVisible);

  return (
    <>
      <h1>Info</h1>
      <Button onClick={goBack} variant="icon"><Icon name="back"/></Button>
      <Button onClick={toggleInfo}>Toggle Info</Button>
      {infoVisible && <p>This is ViewARs react sample app. Check out our <a href="https://portal.viewar.com" target="_new">Portal</a>.</p>}
      <Button onClick={toggleVersion}>Toggle Version Info</Button>
      {versionVisible && <p>{JSON.stringify(viewarApi.versionInfo)}</p>}
    </>
  );
};

Info.propTypes = PagePropTypes;

export default withRouter(Info);
