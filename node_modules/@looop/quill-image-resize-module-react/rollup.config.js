import svg from 'rollup-plugin-svg'
import babel from 'rollup-plugin-babel'
import sourcemaps from 'rollup-plugin-sourcemaps'
import resolve from 'rollup-plugin-node-resolve'
import pkgJson from './package.json'

export default {
  plugins: [
    svg(),
    babel(),
    sourcemaps(),
    resolve({
      extensions: ['.svg']
    })
  ],
  input: './src/ImageResize.js',
  output: [
    {
      file: pkgJson.main,
      sourcemap: true,
      format: 'cjs'
    },
    {
      file: pkgJson.module,
      sourcemap: true,
      format: 'es'
    }
  ]
}
