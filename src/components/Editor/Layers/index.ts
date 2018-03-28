import {RootState} from "store/type";
import Layers, {LayersProps} from "components/Editor/Layers/Layers";
import {currentLayoutData, nextLayerId} from "selectors";
import {setActiveLayer} from "actions/builder";
import {LayerData} from "reducers/layout";
import {addLayer, updateLayer} from "actions/layout";
import {connect} from "react-redux";

const mapStateToProps = (state: RootState): Partial<LayersProps> => {
  return {
    layers: currentLayoutData(state).layers,
    activeLayerId: state.builder.activeLayerId,
    nextLayerId: nextLayerId(state)
  }
}

const mapDispatchToProps = (dispatch): Partial<LayersProps>  => {
  return {
    setActiveLayer: (layerId: number) => dispatch(setActiveLayer(layerId)),
    updateLayer: (item: Partial<LayerData>) => dispatch(updateLayer({item})),
    addLayer: (item: LayerData) => dispatch(addLayer({item}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layers)
