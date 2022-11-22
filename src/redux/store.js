import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import SideMenuReducer from "./reducers/sideMenuReducer";
import CommonReducer from "./reducers/commonReducer";

const rootReducer = combineReducers({
  SideMenuReducer,
  CommonReducer,
});

const persistConfig = {
  key: "holy",
  storage,
  blacklist: ['CommonReducer'] // navigation will not be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(persistedReducer, applyMiddleware(thunk));
let persistor = persistStore(store);

export { store, persistor };
