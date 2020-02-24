import { connect } from 'react-redux';

import NovelInventory from '../components/novel-inventory/NovelInventory';
// import NovelInventoryEdit from '../components/novel-location/NovelLocationEdit';
import { RootState } from '../reducers';

const mapStateToProps = (state: RootState) => ({
	expand: state.sidebar.expand
});

export const NovelInventoryContainer = connect(mapStateToProps)(NovelInventory);
// export const NovelInventoryEditContainer = connect(mapStateToProps)(NovelInventoryEdit);
