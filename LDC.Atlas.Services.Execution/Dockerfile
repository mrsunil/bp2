FROM microsoft/dotnet:2.2-aspnetcore-runtime
ARG source
WORKDIR /app
EXPOSE 80
COPY ${source:-obj/Docker/publish} .
ADD ${source:-obj/Docker/publish/ldc_ca_root.crt} /usr/local/share/ca-certificates/ldc_ca_root.crt
RUN update-ca-certificates
ENTRYPOINT ["dotnet", "LDC.Atlas.Services.Execution.dll"]
