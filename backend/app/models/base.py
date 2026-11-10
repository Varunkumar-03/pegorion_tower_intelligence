from sqlalchemy.orm import declared_attr
from .base_class import Base

# Base models inherit from this
from .identity import Organization, User, Team, Membership, Role, Permission, ProjectMember, team_memberships
from .infrastructure import Property, TowerSite, SiteAsset, Equipment, Carrier, CarrierRelationship
from .property_lease import Landlord, OwnershipRecord, Lease, LeaseParty, LeaseVersion, Amendment, Obligation, Deadline
from .contracts import Contract, Clause, Playbook, PlaybookRule, ContractReview, ReviewFinding
from .legal import LegalMatter, MatterParty, MatterDocument, CaseEvent, LegalSource, LegalCitation, LegalDraft
from .operations import Workflow, WorkflowVersion, WorkflowRun, Task, Approval, Notification
from .documents import Document, DocumentVersion, DocumentPage, DocumentChunk, ExtractedEntity, ProcessingJob, AiRun, Agent, AgentExecution, Citation, RetrievalLog, ModelUsage, EvaluationResult
from .governance import AuditEvent, AccessLog, RetentionPolicy, LegalHold, SecurityEvent