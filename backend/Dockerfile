FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# pc-components-store API image
WORKDIR /app
EXPOSE 8080
# Railway injects $PORT; fall back to 8080 for local docker runs.

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PcStore.Api.csproj", "./"]
RUN dotnet restore "PcStore.Api.csproj"
COPY . .
RUN dotnet publish "PcStore.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["sh", "-c", "dotnet PcStore.Api.dll --urls http://+:${PORT:-8080}"]
