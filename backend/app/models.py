"""
SkyWorker — Реестр операторов. Модели БД (SQLAlchemy 2.0, PostgreSQL).
Все id — UUID (как у SkyWorker ERP). Поля external_* — задел под будущую стыковку.
Черновик Фазы 1. Наполнение (услуги, критерии допусков) уточним по документам Нурлана.
"""
import uuid
from datetime import datetime, date
from sqlalchemy import String, Text, Boolean, Integer, Numeric, ForeignKey, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


def pk():
    return mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


# ─────────── Справочники ───────────
class Direction(Base):
    """Направление применения дрона (агро, геодезия, инспекция…). Расширяемый справочник."""
    __tablename__ = "directions"
    id: Mapped[uuid.UUID] = pk()
    code: Mapped[str] = mapped_column(String(50), unique=True)      # agro, geodesy…
    title: Mapped[str] = mapped_column(String(120))
    icon: Mapped[str | None] = mapped_column(String(16))
    sort: Mapped[int] = mapped_column(Integer, default=100)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Region(Base):
    """Регион. external_id — под regions.id в SkyWorker ERP."""
    __tablename__ = "regions"
    id: Mapped[uuid.UUID] = pk()
    external_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    title: Mapped[str] = mapped_column(String(120))


# ─────────── Оператор ───────────
class Operator(Base):
    __tablename__ = "operators"
    id: Mapped[uuid.UUID] = pk()
    external_user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)  # под users.id

    full_name: Mapped[str] = mapped_column(String(160))
    photo_url: Mapped[str | None] = mapped_column(String(400))
    phone: Mapped[str | None] = mapped_column(String(32))
    whatsapp: Mapped[str | None] = mapped_column(String(32))
    email: Mapped[str | None] = mapped_column(String(160))

    # наёмный / услуги / оба
    work_mode: Mapped[str] = mapped_column(String(16), default="hired")
    region_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("regions.id"), nullable=True)
    city: Mapped[str | None] = mapped_column(String(120))
    about: Mapped[str | None] = mapped_column(Text)

    rating: Mapped[float] = mapped_column(Numeric(2, 1), default=0)
    reviews_count: Mapped[int] = mapped_column(Integer, default=0)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    consent_pd: Mapped[bool] = mapped_column(Boolean, default=False)         # согласие на обработку ПД
    consent_marketing: Mapped[bool] = mapped_column(Boolean, default=False)  # согласие на рассылки

    # --- поля по документу «Профиль оператора БАС» (Жолдузай) ---
    executor_type: Mapped[str] = mapped_column(String(24), default="own_bas")  # own_bas / no_bas / fleet_owner
    # категория оператора 1/2/3 — в таблице permissions (Permission.category)
    current_model: Mapped[str | None] = mapped_column(String(120))   # на чём работает сейчас (DJI Agras T70)
    past_models: Mapped[str | None] = mapped_column(String(240))     # на чём работал раньше (T50/T100)
    own_drone: Mapped[bool] = mapped_column(Boolean, default=False)
    drone_registered: Mapped[bool] = mapped_column(Boolean, default=False)
    drone_reg_number: Mapped[str | None] = mapped_column(String(40)) # госномер БАС
    has_spreader: Mapped[bool] = mapped_column(Boolean, default=False)   # бак-разбрасыватель (ключевой признак)
    has_car: Mapped[bool] = mapped_column(Boolean, default=False)
    has_trailer: Mapped[bool] = mapped_column(Boolean, default=False)
    has_special_trailer: Mapped[bool] = mapped_column(Boolean, default=False)
    has_water_tank: Mapped[bool] = mapped_column(Boolean, default=False)
    exp_total_years: Mapped[int | None] = mapped_column(Integer)     # общий опыт с БАС
    exp_agro_years: Mapped[int | None] = mapped_column(Integer)      # опыт с агродронами
    seasons: Mapped[int | None] = mapped_column(Integer)            # кол-во сезонов
    hectares: Mapped[int | None] = mapped_column(Integer)          # обработано га

    availability: Mapped[str] = mapped_column(String(16), default="open")  # open / busy / dnd (контроль потока)
    price_visibility: Mapped[str] = mapped_column(String(12), default="open")  # open / on_request / negotiable

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    directions: Mapped[list["OperatorDirection"]] = relationship(back_populates="operator")
    permissions: Mapped[list["Permission"]] = relationship(back_populates="operator")
    equipment: Mapped[list["Equipment"]] = relationship(back_populates="operator")
    services: Mapped[list["Service"]] = relationship(back_populates="operator")
    portfolio: Mapped[list["PortfolioItem"]] = relationship(back_populates="operator")
    reviews: Mapped[list["Review"]] = relationship(back_populates="operator")


class OperatorDirection(Base):
    __tablename__ = "operator_directions"
    id: Mapped[uuid.UUID] = pk()
    operator_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("operators.id"))
    direction_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("directions.id"))
    skills: Mapped[str | None] = mapped_column(Text)  # навыки внутри направления
    operator: Mapped["Operator"] = relationship(back_populates="directions")


class Permission(Base):
    """Допуск/сертификат оператора. Категория 1/2/3, свидетельство внешнего пилота."""
    __tablename__ = "permissions"
    id: Mapped[uuid.UUID] = pk()
    operator_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("operators.id"))
    category: Mapped[str | None] = mapped_column(String(40))     # "Категория 2" и т.п.
    title: Mapped[str] = mapped_column(String(160))             # "Свидетельство внешнего пилота"
    issued_by: Mapped[str | None] = mapped_column(String(160))
    valid_until: Mapped[date | None] = mapped_column(Date)
    verify_status: Mapped[str] = mapped_column(String(20), default="pending")  # pending/verified/rejected
    operator: Mapped["Operator"] = relationship(back_populates="permissions")


class Equipment(Base):
    """Оборудование оператора (для режима «услуги»)."""
    __tablename__ = "equipment"
    id: Mapped[uuid.UUID] = pk()
    operator_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("operators.id"))
    model: Mapped[str] = mapped_column(String(120))   # DJI Agras T50
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    operator: Mapped["Operator"] = relationship(back_populates="equipment")


class Service(Base):
    """Услуга оператора. Поля цены/единицы уточним по прайсам Нурлана."""
    __tablename__ = "services"
    id: Mapped[uuid.UUID] = pk()
    operator_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("operators.id"))
    direction_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("directions.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(160))
    description: Mapped[str | None] = mapped_column(Text)
    unit: Mapped[str | None] = mapped_column(String(32))       # га / сезон / разово
    price_from: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    operator: Mapped["Operator"] = relationship(back_populates="services")


class PortfolioItem(Base):
    __tablename__ = "portfolio"
    id: Mapped[uuid.UUID] = pk()
    operator_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("operators.id"))
    media_type: Mapped[str] = mapped_column(String(10))  # photo / video
    url: Mapped[str] = mapped_column(String(400))
    caption: Mapped[str | None] = mapped_column(String(200))
    operator: Mapped["Operator"] = relationship(back_populates="portfolio")


class Review(Base):
    __tablename__ = "reviews"
    id: Mapped[uuid.UUID] = pk()
    operator_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("operators.id"))
    author_name: Mapped[str] = mapped_column(String(160))
    rating: Mapped[int] = mapped_column(Integer)  # 1..5
    text: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    operator: Mapped["Operator"] = relationship(back_populates="reviews")


# ─────────── Сторона заказчика ───────────
class Customer(Base):
    """Заказчик. external_org_id — под organizations.id в SkyWorker ERP."""
    __tablename__ = "customers"
    id: Mapped[uuid.UUID] = pk()
    external_org_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    company_name: Mapped[str | None] = mapped_column(String(200))
    contact_name: Mapped[str] = mapped_column(String(160))
    phone: Mapped[str | None] = mapped_column(String(32))
    region_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("regions.id"), nullable=True)
    consent_pd: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Request(Base):
    """Заявка заказчика на оператора/услугу."""
    __tablename__ = "requests"
    id: Mapped[uuid.UUID] = pk()
    customer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("customers.id"))
    direction_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("directions.id"), nullable=True)
    region_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("regions.id"), nullable=True)
    kind: Mapped[str] = mapped_column(String(16), default="hire")  # hire / service
    description: Mapped[str | None] = mapped_column(Text)
    budget: Mapped[str | None] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(20), default="open")  # open/in_progress/closed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
