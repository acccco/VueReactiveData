import {
    isPreTag,
    mustUseProp,
    isReservedTag,
    getTagNamespace
} from '../util/index'

import {genStaticKeys} from '../../../util/normal-util'
import {isUnaryTag, canBeLeftOpenTag} from './util'

export const baseOptions = {
    expectHTML: true,
    modules: [],
    directives: {},
    isPreTag,
    isUnaryTag,
    mustUseProp,
    canBeLeftOpenTag,
    isReservedTag,
    getTagNamespace,
    staticKeys: genStaticKeys([])
}
