package com.kosal.crm.service;

import com.kosal.crm.dto.LoginRequest;
import com.kosal.crm.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}