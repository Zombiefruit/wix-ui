import * as React from 'react';
import uniqueId = require('lodash.uniqueid');
import {Divider} from '../../components/Divider';
import {Highlighter} from '../Highlighter';

export interface Option {
  id: number | string;
  isDisabled: boolean;
  isSelectable: boolean;
  value: string;
  render: (value: React.ReactNode) => React.ReactNode;
}

const createOption = (option: Partial<Option> = null) =>
  Object.assign({},
    {
      id: option && (option.id || option.id === 0) ? option.id : uniqueId('Option'),
      isDisabled: false,
      isSelectable: true,
      value: null,
      render: val => val
    },
    option);

const escapeRegExp = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const hightlightMatches = (option: Option, searchTerm: string): Option => {
  const parts: Array<React.ReactNode> = option.value.split(new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi'));
  for (let i = 1; i < parts.length; i += 2) {
    parts[i] = <Highlighter key={i}>{parts[i]}</Highlighter>;
  }

  return createOption({
    id: option.id,
    isDisabled: option.isDisabled,
    isSelectable: option.isSelectable,
    value: option.value,
    render: () => option.render(parts)
  });
};

export const OptionFactory = {
  create: createOption,
  createDivider({className = null, value = null} = {}): Option {
    return createOption({
      id: uniqueId('Divider'),
      isDisabled: false,
      isSelectable: false,
      render: value ? () => <Divider className={className}>{value}</Divider> : () => <Divider className={className}/>
    });
  },
  createHighlighted(
    option: Option,
    hightlightValue: string): Option {
      return option.value && hightlightValue ? hightlightMatches(option, hightlightValue) : option;
    }
};
