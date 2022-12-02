import { ResourceBase } from '@/utils/models';

export interface Model extends ResourceBase {
  /** 名称 */
  name?: string;
  /** 版本号 */
  version?: string;

  /** 功能说明 */
  description?: string;

  /** CAE类型 */
  caeSoftType?: number;

  /** CAE类型key对应的lable */
  caeSoftTypeLable?: string;

  /** 软件类型版本 */
  versions?: Array<string>;

  /** 资源文件MD5 */
  mainFilePath?: string;

  /** 资源文件名称 */
  mainFileName?: string;

  /** 描述文件MD5 */
  descriptionFilePath?: string;

  /** 描述文件名称 */
  descriptionFileName?: string;

  /** 软件版本 */
  softVersionString?: string;
}
