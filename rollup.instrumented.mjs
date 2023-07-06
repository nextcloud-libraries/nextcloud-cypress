import config from './rollup.config.mjs'
import istanbul from 'rollup-plugin-istanbul'

config.map(c => c.plugins.push(istanbul()))

export default config
