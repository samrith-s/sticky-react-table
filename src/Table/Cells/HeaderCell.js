import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { omit } from "lodash";
import classNames from "classnames";

export default class HeaderCell extends PureComponent {
  render() {
    const { title, style, isLastSticky, renderer, onDragEnd } = this.props;
    return (
      <div
        className={classNames("React-Sticky-Table--Header-Cell", {
          "React-Sticky-Table--is-Last-Sticky": isLastSticky
        })}
        style={style}
      >
        {renderer ? renderer(omit(this.props, "renderer")) : title}
        <div
          className="React-Sticky-Table-Resize-Handler"
          draggable={true}
          onDragEnd={onDragEnd}
        />
      </div>
    );
  }
}
