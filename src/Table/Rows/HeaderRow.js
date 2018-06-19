import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { HeaderCell } from './Cells';

export default class HeaderRow extends PureComponent {
    renderColumns = () => {
        const {
            columns,
            rowIndex,
            styleCalculator,
            stickyFunction,
            onDragEnd
        } = this.props;

        return columns.map((column, index) => {
            const { title, width, dataKey, headerRenderer } = column;
            const style = { width, ...styleCalculator(index) };
            return (
                <HeaderCell
                    title={title}
                    width={width}
                    dataKey={dataKey}
                    index={index}
                    style={style}
                    isLastSticky={stickyFunction(index)}
                    renderer={headerRenderer}
                    cellIndex={index}
                    rowIndex={rowIndex}
                    onDragEnd={onDragEnd(index)}
                    key={`sitcky-table-header-${index}`}
                />
            );
        });
    };

    render() {
        return (
            <div className="React-Sticky-Table--Header">
                {this.renderColumns()}
            </div>
        );
    }
}
