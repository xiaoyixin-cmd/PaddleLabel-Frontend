/* tslint:disable */
/* eslint-disable */
/**
 * PaddleLabel API Specs
 * Back end APIs for PP-Label
 *
 * The version of the OpenAPI document: 0.1.0
 * Contact: me@linhan.email
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from '../runtime';
import type { GetFoldersRequest, Polygon2pointsRequest } from '../models';
import {
  GetFoldersRequestFromJSON,
  GetFoldersRequestToJSON,
  Polygon2pointsRequestFromJSON,
  Polygon2pointsRequestToJSON,
} from '../models';

export interface GetFoldersOperationRequest {
  getFoldersRequest?: GetFoldersRequest;
}

export interface Polygon2pointsOperationRequest {
  polygon2pointsRequest?: Polygon2pointsRequest;
}

/**
 *
 */
export class RpcApi extends runtime.BaseAPI {
  /**
   *
   */
  async getFoldersRaw(
    requestParameters: GetFoldersOperationRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<void>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters['Content-Type'] = 'application/json';

    const response = await this.request(
      {
        path: `/rpc/folders`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: GetFoldersRequestToJSON(requestParameters.getFoldersRequest),
      },
      initOverrides,
    );

    return new runtime.VoidApiResponse(response);
  }

  /**
   *
   */
  async getFolders(
    getFoldersRequest?: GetFoldersRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<void> {
    await this.getFoldersRaw({ getFoldersRequest: getFoldersRequest }, initOverrides);
  }

  /**
   *
   */
  async polygon2pointsRaw(
    requestParameters: Polygon2pointsOperationRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<string>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters['Content-Type'] = 'application/json';

    const response = await this.request(
      {
        path: `/rpc/seg/polygon2points`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: Polygon2pointsRequestToJSON(requestParameters.polygon2pointsRequest),
      },
      initOverrides,
    );

    return new runtime.TextApiResponse(response) as any;
  }

  /**
   *
   */
  async polygon2points(
    polygon2pointsRequest?: Polygon2pointsRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<string> {
    const response = await this.polygon2pointsRaw(
      { polygon2pointsRequest: polygon2pointsRequest },
      initOverrides,
    );
    return await response.value();
  }
}
