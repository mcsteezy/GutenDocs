/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import SidebarFuncEntry from './SidebarFuncEntry';
/* eslint-enable */

const HeaderComment = ({ parsedData }) => {
  const uniqueHeaders = (arrayOfComments) => {
    const allHeaders = [];
    arrayOfComments.forEach(comment => allHeaders.push(comment.header));
    return Array.from(new Set(allHeaders));
  };

  const filterHeaders = (header, commentsArray) => commentsArray
    .filter(entry => header === entry.header);
  return (
    <ul>
      {
        uniqueHeaders(parsedData).map(header => (
          <div key={header}>
            <h5>
              {header}
            </h5>
            {
              filterHeaders(header, parsedData)
                .map(funcComment => <SidebarFuncEntry comment={funcComment} key={funcComment.id} />)
            }
          </div>
        ))
      }
    </ul>);
};

HeaderComment.propTypes = {
  /* eslint-disable-next-line */
  parsedData: PropTypes.array.isRequired,
};

export default HeaderComment;