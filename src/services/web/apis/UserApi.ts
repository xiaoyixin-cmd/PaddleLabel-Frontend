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
import type { PaddlelabelApiControllerUserLoginRequest, User } from '../models';
import {
  PaddlelabelApiControllerUserLoginRequestFromJSON,
  PaddlelabelApiControllerUserLoginRequestToJSON,
  UserFromJSON,
  UserToJSON,
} from '../models';

export interface GetRequest {
  uuid: string;
}

export interface PaddlelabelApiControllerUserLoginOperationRequest {
  paddlelabelApiControllerUserLoginRequest?: PaddlelabelApiControllerUserLoginRequest;
}

export interface RemoveRequest {
  uuid: string;
}

export interface UpdateRequest {
  uuid: string;
  user: User;
}

/**
 *
 */
export class UserApi extends runtime.BaseAPI {
  /**
   *
   * Add a new user
   */
  async createRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<User>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    const response = await this.request(
      {
        path: `/users`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
  }

  /**
   *
   * Add a new user
   */
  async create(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
    const response = await this.createRaw(initOverrides);
    return await response.value();
  }

  /**
   *
   * Get info of a specific user
   */
  async getRaw(
    requestParameters: GetRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<User>> {
    if (requestParameters.uuid === null || requestParameters.uuid === undefined) {
      throw new runtime.RequiredError(
        'uuid',
        'Required parameter requestParameters.uuid was null or undefined when calling get.',
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    const response = await this.request(
      {
        path: `/users/{uuid}`.replace(
          `{${'uuid'}}`,
          encodeURIComponent(String(requestParameters.uuid)),
        ),
        method: 'GET',
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
  }

  /**
   *
   * Get info of a specific user
   */
  async get(
    uuid: string,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<User> {
    const response = await this.getRaw({ uuid: uuid }, initOverrides);
    return await response.value();
  }

  /**
   * Get all users
   */
  async getAllRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<Array<User>>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    const response = await this.request(
      {
        path: `/users`,
        method: 'GET',
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(UserFromJSON));
  }

  /**
   * Get all users
   */
  async getAll(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<User>> {
    const response = await this.getAllRaw(initOverrides);
    return await response.value();
  }

  /**
   * Login and get JWT
   */
  async paddlelabelApiControllerUserLoginRaw(
    requestParameters: PaddlelabelApiControllerUserLoginOperationRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<void>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters['Content-Type'] = 'application/json';

    const response = await this.request(
      {
        path: `/users/login`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: PaddlelabelApiControllerUserLoginRequestToJSON(
          requestParameters.paddlelabelApiControllerUserLoginRequest,
        ),
      },
      initOverrides,
    );

    return new runtime.VoidApiResponse(response);
  }

  /**
   * Login and get JWT
   */
  async paddlelabelApiControllerUserLogin(
    paddlelabelApiControllerUserLoginRequest?: PaddlelabelApiControllerUserLoginRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<void> {
    await this.paddlelabelApiControllerUserLoginRaw(
      { paddlelabelApiControllerUserLoginRequest: paddlelabelApiControllerUserLoginRequest },
      initOverrides,
    );
  }

  /**
   * Delete a user
   * Delete a user
   */
  async removeRaw(
    requestParameters: RemoveRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<void>> {
    if (requestParameters.uuid === null || requestParameters.uuid === undefined) {
      throw new runtime.RequiredError(
        'uuid',
        'Required parameter requestParameters.uuid was null or undefined when calling remove.',
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    const response = await this.request(
      {
        path: `/users/{uuid}`.replace(
          `{${'uuid'}}`,
          encodeURIComponent(String(requestParameters.uuid)),
        ),
        method: 'DELETE',
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.VoidApiResponse(response);
  }

  /**
   * Delete a user
   * Delete a user
   */
  async remove(
    uuid: string,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<void> {
    await this.removeRaw({ uuid: uuid }, initOverrides);
  }

  /**
   * Edit user info.
   * Edit user info
   */
  async updateRaw(
    requestParameters: UpdateRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<User>> {
    if (requestParameters.uuid === null || requestParameters.uuid === undefined) {
      throw new runtime.RequiredError(
        'uuid',
        'Required parameter requestParameters.uuid was null or undefined when calling update.',
      );
    }

    if (requestParameters.user === null || requestParameters.user === undefined) {
      throw new runtime.RequiredError(
        'user',
        'Required parameter requestParameters.user was null or undefined when calling update.',
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters['Content-Type'] = 'application/json';

    const response = await this.request(
      {
        path: `/users/{uuid}`.replace(
          `{${'uuid'}}`,
          encodeURIComponent(String(requestParameters.uuid)),
        ),
        method: 'PUT',
        headers: headerParameters,
        query: queryParameters,
        body: UserToJSON(requestParameters.user),
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
  }

  /**
   * Edit user info.
   * Edit user info
   */
  async update(
    uuid: string,
    user: User,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<User> {
    const response = await this.updateRaw({ uuid: uuid, user: user }, initOverrides);
    return await response.value();
  }
}
