import React, { Component } from 'react';
import axios from 'axios';

import '../../css/LiveStreams.scss';
import Pagination from '../component/Pagination';
import StreamCard from '../component/StreamCard';
import LanguageButtons from '../component/LanguageButtons'

class App extends Component {
  constructor() {
    super();
    this.state = { currentStreams: [], currentPage: null, totalStreams: null, totalPages: null, lang: "en" }

    // bind function in constructor instead of render (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)
    this.onChangePage = this.onChangePage.bind(this);
    this.handleLangClick = this.handleLangClick.bind(this);
  }

  componentDidMount() {
    this.updateStreamItems(1, 18);
  }

  handleLangClick(selectedLang) {
    this.setState({ lang: selectedLang });
  }

  updateStreamItems(page, offset) {
    const app = this.props.app;
    var url;
    if(app === "twitch") {
      const lang = this.state.lang;
      url = `http://localhost:8080/api/${app}/slist/${lang}/${page}/${offset}`;
    } else if(app === "nginx") {
      url = `http://localhost:8080/api/${app}/list/${page}/${offset}`;
    }

    axios.get(url)
    .then(res => {
      this.setState({ currentStreams: res.data.data, totalStreams: res.data.total });
    })
  }

  onChangePage(page, offset) {
    // update state with new page of items
    this.updateStreamItems(page, offset);
  }

  render() {
    const { currentStreams, currentPage, totalStreams, totalPages, lang } = this.state;

    if (!totalStreams || totalStreams === 0) return (<div className="live-container"></div>);

    const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();

    return (
      <div className="live-container">
        <div className="pagination-container d-flex flex-row align-items-center">
          <div className="d-flex flex-row align-items-center">
            <h2 className={headerClass}>
              <strong className="text-secondary">{totalStreams}</strong> {totalStreams <= 1 ? "Stream" : "Streams"}
            </h2>
            {currentPage && (
              <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                Page <span className="font-weight-bold">{currentPage}</span> / <span className="font-weight-bold">{totalPages}</span>
              </span>
            )}
          </div>
          <div className="d-flex flex-row py-3 align-items-center">
            <Pagination totalItems={totalStreams} onChangePage={this.onChangePage} lang={lang}/>
          </div>
          {
              this.props.app === "twitch"
              ?
              <div>
                <LanguageButtons handleLangClick={this.handleLangClick}/>
              </div>
              :
              <></>
            }
        </div>
        <div className="flex-container">
          {currentStreams.map(stream => 
            <div key={stream.id} className="item auto">
              <StreamCard app={this.props.app} stream={stream} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;